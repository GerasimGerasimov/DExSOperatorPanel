import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from '../HOC/Modal/Modal';
import { LoginForm } from './forms/LoginForm/LoginForm';
import { CreateUserForm } from './forms/CreateUserForm/CreateUserForm';
import { UpdateUserForm } from './forms/UpdateUserForm/UpdateUserForm';
import './users.scss';
import axios from 'axios';
import { userServiceUrl } from '../../services-urls';
import { IUserModel } from '../../interfaces/IUserModel';
import styled from 'styled-components';

const StyledNavLink = styled(NavLink)`
    color: #ffffff;
    text-decoration: none;

    &:hover {
        color: #ffffff;
        text-decoration: none;
    }
`;

interface IUsersContainerProps {
};

interface IUserState {
    userList: Array<IUserModel>;
    id: number | undefined;
}

export class Users extends Component<IUsersContainerProps, IUserState> {
    private host: string = userServiceUrl;

    constructor (props: IUserState) {
        super(props);
        this.state = {
            userList: [],
            id: undefined
        };
    };

    componentDidMount = () : void => {
        this.getAllUsers();
    };

    private getAllUsers = async () => {
        try {
            const response = await axios.get(`${this.host}/api/users`);
            this.setState({ userList: response.data });
        } catch (error) {
            console.log(error);
        }
    };

    render () {
        return (
            <>
            <div className="table-responsive">
                <table className="table table-bordered table-condensed table-hover">
                    <thead>
                        <tr>
                            <th
                                style={{
                                    border: "none"
                                }}
                            >
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    <StyledNavLink
                                        to={"/create-user"}
                                    >
                                        Add user
                                    </StyledNavLink>
                                </button>
                            </th>
                        </tr>
                        <tr>
                            <th>Id</th>
                            <th>First Name</th>
                            <th>Second Name</th>
                            <th>Role</th>
                            <th>Login Time</th>
                            <th>Edit</th>
                        </tr>
                        {this.state.userList.map((value, i) => {
                            return (
                                <tr key={`${value}_${i}`}>
                                    <th>{value.id}</th>
                                    <th>{value.firstName}</th>
                                    <th>{value.secondName}</th>
                                    <th>{value.role}</th>
                                    <th>{value.loginTime}</th>
                                    <th>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => this.setState({
                                                id: value.id
                                            })}
                                        >
                                            <StyledNavLink
                                                to={{ pathname: "/edit-user/:id", state: { id: value.id } }}
                                            >
                                                Edit user
                                            </StyledNavLink>
                                        </button>
                                    </th>
                                </tr>
                            )
                        })}
                    </thead>
                </table>
            </div>
        </>
        );
    }
};
