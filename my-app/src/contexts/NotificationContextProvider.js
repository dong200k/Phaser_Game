import React, { createContext, Component, useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { getDeepCopy } from "../util";

/** The notification context contains callbacks to easily display notifications on screen. */
export const NotificationContext = createContext();

const NotificationContextProvider = (props) => {
    
    const maxToastCount = 6;
    const [ toasts, setToasts ] = useState([
        // {
        //     key: 0,
        //     title: "Hello",
        //     titleNote: "hello",
        //     message: "hello message",
        //     show: false,
        //     icon: "spinner",
        // },
    ]);

    const notify = (data) => {
        let newToast = {
            key: Math.random(),
            title: data?.title ?? "Notification",
            titleNote: data?.titleNote ?? "",
            message: data?.message ?? "",
            show: true,
            icon: data?.icon ?? "",
            bg: data?.bg ?? "",
        };
        let newToasts = getDeepCopy(toasts);
        newToasts.push(newToast);
        // Limit the toast count to 10.
        if(newToasts.length > maxToastCount) newToasts.shift();
        setToasts(newToasts);
    }

    const notifyResponse = (res) => {
        let status = res.status;
        let bg = "success";
        if(status >= 400 && status <= 599) bg = "warning";
        res.json().then((json) => {
            notify({
                title: "Response",
                bg,
                titleNote: `Status Code: ${status}`,
                message: `${json.message}`,
            })
        }).catch((message) => {
            notify({
                title: "Response",
                bg,
                titleNote: `Status Code: ${status}`,
                message: `${message.message}`,
            })
        });
    }

    const removeToast = (key) => {
        setToasts(getDeepCopy(toasts).filter((toast) => toast.key !== key));
    }

    const closeToast = (key) => {
        let newToasts = getDeepCopy(toasts);
        newToasts.forEach((toast) => {
            if(toast.key === key) toast.show = false;
        })
        setToasts(newToasts);
        setTimeout(() => {removeToast(key)}, 200);
    }

    // console.log(toasts);

    const toastsDisplay = (
        <ToastContainer className="p-5" position="top-end">
            {toasts.map((toast => {

                let iconDisplay;
                if(toast.icon) {
                    switch(toast.icon) {
                        case "spinner": iconDisplay = (
                                <Spinner animation="border" role="status" size="sm" style={{marginRight: "5px"}}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            ); break;
                    }
                }

                return (
                    <Toast 
                        key={toast.key} 
                        bg={toast.bg} 
                        onClose={() => closeToast(toast.key)} 
                        autohide={true}
                        show={toast.show}
                        delay={10000}
                    >
                        <Toast.Header>
                            {iconDisplay}
                            <strong className="me-auto">{toast.title}</strong>
                            <small className="text-muted">{toast.titleNote}</small>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                )
            }))}
        </ToastContainer>
    )
    

    return (
        <NotificationContext.Provider value={{notify, notifyResponse}}>
            {toastsDisplay}
            {props.children}
        </NotificationContext.Provider>
    );

}

export default NotificationContextProvider;