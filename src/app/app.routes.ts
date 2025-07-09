import { Routes } from "@angular/router";
import { Home } from "./components/home/home";
import { Login } from "./components/login/login";
import { CreateAccount } from "./components/create-account/create-account";
import { MainPage } from "./components/main-page/main-page";

export const routes: Routes = [
    {
        path: "",
        component: Home
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "create-account",
        component: CreateAccount
    },
    {
        path: "main-page",
        component: MainPage
    }
];