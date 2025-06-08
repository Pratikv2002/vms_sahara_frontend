import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function ProtectedRoute({ component: Component,child:Child }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get("auth")) {
            navigate('/');
        }
    }, [navigate]);

    return <Component child={Child} />;
}
