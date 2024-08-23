import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { IUserModel } from "../../../../interfaces/IUserModel";
import axios from "axios";
import { userServiceUrl } from "../../../../services-urls";
import { roles } from "../../roles";
import { RoleSelect } from "../../RoleSelect";

const UpdateUserFormContainer = styled.div`
    width: 32%;
    height: 16%;
    position: relative;
    top: 25%;
    z-index: 2;
    display: block;
    margin: 0 auto;
`;

type Props = {
    id: number;
    onClose : () => void;
    onSave : () => void;
};

export const UpdateUserForm = (props: Props) => {
    const [newFirstName, setNewFirstName] = useState<string | undefined>(undefined);
    const [newSecondName, setNewSecondName] = useState<string| undefined>(undefined);
    const [newPassword, setNewPassword] = useState<string | undefined>(undefined);
    const [passwordConfirm, setPasswordConfirm] = useState<string | undefined>(undefined);
    const [newRole, setNewRole] = useState<string | undefined>(undefined);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUserModel | undefined>(undefined);

    const handleFirstNameInput = (event: any) => setNewFirstName(event.target.value);

    const handleSecondNameInput = (event: any) => setNewSecondName(event.target.value);

    const handlePasswordInput = (event: any) => setNewPassword(event.target.value);

    const handlePasswordConfirm = (event: any) => setPasswordConfirm(event.target.value);

    const handleNewRoleValue = (event: any) => setNewRole(event.target.value);

    console.log(props.id);

    const getUser = async () => {
        const userId = props.id;
        try {
            const response = await axios.get(`${userServiceUrl}/api/user?id=${userId}`);
            setCurrentUser(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    console.log(currentUser);

    const updateUser = async () => {
        try {
            const config = {
                "firstName": `${newFirstName}`,
                "secondName": `${newSecondName}`,
                "password": `${newPassword}`,
                "role": `${newRole}`
            };

            await axios.put(`${userServiceUrl}/api/user?id=${currentUser?.id}`, config);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = async () => {
        try {
            await axios.delete(`${userServiceUrl}/api/user?id=${currentUser?.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (
            newPassword === undefined ||
            passwordConfirm === undefined ||
            newPassword !== passwordConfirm
        ) {
            setIsSaveButtonDisabled(true);
        } else {
            setIsSaveButtonDisabled(false);
        }
    }, [newPassword, passwordConfirm]);

    return (
        <UpdateUserFormContainer>
            <div className="mb-3">
                <label
                    htmlFor="newFirstNameInput"
                    className="form-label"
                >
                    New first name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="newFirstNameInput"
                    placeholder="New first name"
                    value={newFirstName}
                    onChange={handleFirstNameInput}
                />
            </div>
            <div className="mb-3">
                <label
                    htmlFor="newSecondNameInput"
                    className="form-label"
                >
                    Current password
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="newSecondNameInput"
                    placeholder="New second name"
                    value={newSecondName}
                    onChange={handleSecondNameInput}
                />
            </div>
            <div className="mb-3">
            <label htmlFor="roleSelect" className="form-label">New role</label>
                <RoleSelect
                    id="roleSelect"
                    defaultValue=""
                    placeholder='Select role'
                    value={newRole}
                    onChange={handleNewRoleValue}
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
                <label
                    htmlFor="newPasswordInput"
                    className="form-label"
                >
                    New password
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="newPasswordInput"
                    placeholder="New password"
                    value={newPassword}
                    onChange={handlePasswordInput}
                />
            </div>
            <div className="mb-3">
                <label
                    htmlFor="confirmPasswordInput"
                    className="form-label"
                >
                    Repeat password
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="confirmPasswordInput"
                    placeholder="Confirm new password"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirm}
                />
            </div>
            <button
                type="button"
                className="btn btn-primary"
                disabled={isSaveButtonDisabled}
                onClick={updateUser}
            >
                Save user
            </button>
            <button
                type="button"
                className="btn btn-danger"
                style={{ marginLeft: "1rem" }}
                onClick={deleteUser}
            >
                Delete user
            </button>
            <button
                type="button"
                className="btn btn-secondary"
                style={{ marginLeft: "1rem" }}
                onClick={props.onClose}
            >
                Cancel
            </button>
        </UpdateUserFormContainer>
    );
};
