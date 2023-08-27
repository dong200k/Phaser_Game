# Onscreen Notifications

This document will explain how to display onscreen notifications as toasts for the user to see.

## How to use

The notify callback is used to display notifications. It can be accessed through the NotificationContext. An example is shown below,

```
import { NotificationContext } from "../../contexts/NotificationContextProvider";

export default function ExampleComponent() {
    const { notify } = useContext(NotificationContext);

    const onClick = () => {
        notify({
            message: "Hello There!"
        })
    }

    return (
        <button onClick={onClick}>
            Send Notification
        </button>
    )
}
```

The notify function accepts the following config object.
```
{
    message: string;
    title: string;
    titleNote: string;
    bg: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';
}
```