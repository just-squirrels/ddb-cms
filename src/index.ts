import type { APIGatewayProxyEventV2 as EventV2, APIGatewayProxyStructuredResultV2 as ResultV2 } from "aws-lambda";

export async function handler(event: EventV2) {
    const result: ResultV2 = {
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify({ msg: "Hello" }),
        headers: {
            "content-type": "application/json"
        },
        cookies: [
            "foo2=bar",
            "baz=testing; HttpOnly"
        ]
    }

    try {
        // parse & execute
    }
    catch(error) {
        // convert to appropriate 4xx/5xx
    }

    return result;
}
