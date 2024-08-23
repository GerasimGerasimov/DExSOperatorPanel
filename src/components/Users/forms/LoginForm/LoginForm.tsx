import React, { useState } from "react";
import "./login-form.scss";
import styled from "styled-components";

const LoginFormContainer = styled.div`
    width: 32%;
    height: 16%;
    position: relative;
    top: 25%;
    z-index: 2;
    display: block;
    margin: 0 auto;
`;

const UserSelect = styled.select`
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
`;

type Props = { // TODO: define user schema or using user ID
    id: number | undefined;
    password: string | undefined;
    onClose : () => void;
    onLogin : () => void;
};

// TODO: create modals instead of forms
export const LoginForm = (props: Props) => {
    const [password, setPassword] = useState<string | undefined>(undefined);

    const handlePasswordInput = (event: any) => {
        setPassword(event.target.value);
        props.password = password;
    };

    return (
        <LoginFormContainer>
            <div className="mb-3">
            <label htmlFor="userSelect" className="form-label">Select user</label>
                <UserSelect id="userSelect">
                    <option selected>Select user</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </UserSelect>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Email address</label>
                <input
                    type="email"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Password"
                    value={props.password!}
                    onChange={handlePasswordInput}
                />
            </div>
            <button type="button" className="btn btn-primary">Log in</button>
            <button
                type="button"
                className="btn btn-danger"
                style={{ marginLeft: "1rem" }}
                onClick={props.onClose}
                >
                    Cancel
            </button>
        </LoginFormContainer>
    );
};
