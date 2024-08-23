import React, { useEffect, useState } from 'react';
import './create-user-form.scss';
import styled from 'styled-components';
import axios from 'axios';
import { userServiceUrl } from '../../../../services-urls';
import { roles } from '../../roles';
import { RoleSelect } from '../../RoleSelect';

type Props = {
    onCreate : () => void;
    onClose : () => void;
};

export const CreateUserForm = (props: Props) => {
    const [firstName, setFirstName] = useState<string>("");
    const [secondName, setSecondName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [isCreateButtonDisabled, setIsCreateButtonDisabled] = useState<boolean>(false);

    const handleFirstName = (event: any) => {
        event.preventDefault();
        setFirstName(event.target.value);
    };

    const handleSecondName = (event: any) => {
        event.preventDefault();
        setSecondName(event.target.value);
    };

    const handleRole = (event: any) => {
        event.preventDefault();
        setRole(event.target.value);
    };

    const handlePassword = (event: any) => {
        event.preventDefault();
        setPassword(event.target.value);
    };

    const handlePasswordRepeat = (event: any) => {
        event.preventDefault();
        setRepeatPassword(event.target.value);
    };

    useEffect(() => {
        if (
            password !== repeatPassword ||
            firstName === "" ||
            secondName === "" ||
            role === "" ||
            password === ""
        ) {
            setIsCreateButtonDisabled(false);
        } else {
            setIsCreateButtonDisabled(true);
        }
    }, [password, repeatPassword, firstName, secondName, role]);

    const createUser = async () => {
        try {
            const config = {
                firstName: firstName,
                secondName: secondName,
                role: role,
                password: password
            };

            await axios.post(`${userServiceUrl}/api/user`, config);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="firstNameInput" className="form-label">First name</label>
                <input
                    type="text"
                    className="form-control"
                    id="firstNameInput"
                    placeholder="First name"
                    value={firstName}
                    onChange={handleFirstName}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="secondNameInput" className="form-label">Second name</label>
                <input
                    type="text"
                    className="form-control"
                    id="secndNameInput"
                    placeholder="Second name"
                    value={secondName}
                    onChange={handleSecondName}
                />
            </div>
            <div className="mb-3">
            <label htmlFor="roleSelect" className="form-label">Role</label>
                <RoleSelect
                    id="roleSelect"
                    defaultValue=""
                    placeholder='Select role'
                    value={role}
                    onChange={handleRole}
                >
                    {roles.map((value, id) => {
                        return <option
                            key={`${value}_${id}`}
                        >
                            {value}
                        </option>
                    })}
                </RoleSelect>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input
                    type="text"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Password"
                    value={password}
                    onChange={handlePassword}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="passwordRepeatInput" className="form-label">Repeat password</label>
                <input
                    type="text"
                    className="form-control"
                    id="passwordRepeatInput"
                    placeholder="Repeat password"
                    value={repeatPassword}
                    onChange={handlePasswordRepeat}
                />
            </div>
            <button
                type="button"
                className="btn btn-primary"
                onClick={createUser}
                disabled={!isCreateButtonDisabled}
            >
                Create user
            </button>
            <button
                type="button"
                className="btn btn-danger"
                style={{ marginLeft: "1rem" }}
                onClick={props.onClose}
            >
                Cancel
            </button>
        </div>
    );
};
