export interface IUserModel {
    id: number | undefined;
    firstName: string | undefined;
    secondName: string | undefined;
    role: string | undefined;
    password: string | undefined;
    loginTime: Date | undefined;
    isDeleted: boolean;
};
