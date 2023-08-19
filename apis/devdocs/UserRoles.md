# User Roles

This document will describe what user roles are, what they do, and how you can manage them.

## What is a user role

A user role is a piece of information that allows firebase to authorize users to use certain api calls. E.g. only gamemasters can add/edit monsters. Currently there are two roles ("admin", "gamemaster").

User roles are implemented through custom claims. Custom claims are extra pieces of infomation that is encoded into the user's token(through JWT) when sending a request. The benefit of using custom claims for user roles is that it is stored directly on the JWT that is sent with the request. There is no need to fetch the user's document to check the user's role.

## How to manage a user's role

When a new user is created they will have no role assigned to them. To assign a role open apis and my-app. Inside my-app login as the admin. As an admin you can assign/remove user roles. 

Note: A user can only have one role. Assigning a role will overwrite the old role. If the user had no previous role, the new role will be added.

Note: The admin role cannot be added or removed. There is only one admin, which is the admin account.