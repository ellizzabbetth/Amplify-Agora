import React from "react";

/*
const error = {
    message: 'yo'
}
const { message } = error;
So that without destructuring:        {errors.map(( err , i) => <div key={i}>{err.message}</div>)}
*/
const   Error = ({ errors }) => (
    <pre className="error">
        {errors.map(({ message }, i) => <div key={i}>{message}</div>)}

    </pre>
)

export default Error;
