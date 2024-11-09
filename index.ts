import AWS from 'aws-sdk';

AWS.config.update({
    region: "eu-north-1"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const dynamoDBTableName = 'UserInfo';
const signupPath = '/signUp';
const loginPath = '/LogIn';

exports.handler = async function(event) {
    console.log('Request Event: ', event);
    let response;

    switch (true) {
        case event.httpMethod === 'POST' && event.path === signupPath:
            response = await signUp(JSON.parse(event.body));
            break;

        case event.httpMethod === 'POST' && event.path === loginPath:
            response = await LogIn(JSON.parse(event.body));
            break;

        default:
            response = buildResponse(404, '404 Not Found');
    }

    return response;
};

async function signUp(requestBody) {
    const { UserName: userName, Role: role, Name: name, Email: email, Password: password } = requestBody;

    const validEmail = isValidEmail(email);

    if (!validEmail) {
        return buildResponse(400, { Operation: 'SignUp', Message: 'Invalid Email', Error: 'Invalid email address' });
    }

    const getParams = {
        TableName: dynamoDBTableName,
        Key: {
            'UserName': userName,
            'Role' : role
        }
    };

    try {
        const data = await dynamoDB.get(getParams).promise();

        if (data.Item) {
            return buildResponse(400, { Operation: 'SignUp', Message: 'Username exists', Error: 'User already exists' });
        } else {
            const putParams = {
                TableName: dynamoDBTableName,
                Item: {
                    'UserName': userName,
                    'Role' : role,
                    'Name' : name,
                    'Email': email,
                    'Password': password}
            };

            await dynamoDB.put(putParams).promise();

            const body = {
                Operation: 'SignUp',
                Message: 'Signed in successfully',
                Item: { 'UserName': userName, 'Role' : role, 'Email': email }
            };

            return buildResponse(200, body);
        }
    } catch (error) {
        console.error('Error: ', error);
        return buildResponse(500, { Operation: 'SignUp', Message: 'FAILURE', Error: error.toString() });
    }
}

async function LogIn(requestBody) {
    const username = requestBody.UserName;
    const password = requestBody.Password;
    const role = requestBody.Role;

    const getParams = {
        TableName: dynamoDBTableName,
        Key: {
            'UserName': username,
            'Role': role
        }
    };

    try {
        const data = await dynamoDB.get(getParams).promise();

        if (data.Item) {
            if (password === data.Item.Password) {
                const body = {
                    Operation: 'LogIn',
                    Message: 'Logged in successfully, Welcome!',
                    Item: { 'UserName': username, 'Role' : role, 'Email': requestBody.Email }
                };
                return buildResponse(200, body);
            } else {
                return buildResponse(400, { Operation: 'LogIn', Message: 'Invalid Credentials.', Error: 'Invalid Credentials' });
            }
        } else {
            return buildResponse(400, { Operation: 'LogIn', Message: 'Username does not exists.', Error: 'User does not exist' });
        }
    } catch (error) {
        console.error('Error: ', error);
        return buildResponse(500, { Operation: 'LogIn', Message: 'FAILURE', Error: error.toString() });
    }
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}

function isValidEmail(email) {
    const atposition = email.indexOf('@');
    const dotposition = email.lastIndexOf('.');

    if (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length) {
        console.error("Invalid Email.");
        return false;
    } else {
        return true;
    }
}
