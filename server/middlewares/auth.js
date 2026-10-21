import {clerkClient} from "@clerk/express";

export const auth = async (req, res, next) => {
    try{
        const {userId, has} = await req.auth();
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({success: false, message: error.message})
    }
}

/*try catch is for error handling ...if we dont use it ....then for eg user data didnt came from database ...basically it fails ...then server will just crash ....so to avoid server creash ....we use error handling ...try = attempt something, catch = handle failure*/

/*we can attach things to incoming request ...yes ...for eg ... req.plan = 'premium' ...here we are adding new property to request object */

/*some operations take time like fetcing user, DB, API but javascript doesnt wait by default 
so if we dont use async/await then for eg const user = clerkClient.users.getUser(userId); this does not give the user immediately and it gives a promise(pending work) 
but woth async/await, Javascript waits and then gives actual user data 
if you use await then function must be async, becuase async basically allows use of await */

/*const {userId, has} = ... this is destructuring, it is same as - 
const data = await req.auth();
const userId = data.userId;
const has = data.has;*/

//full flow - user sends request, request comes, clerk middleware runs, your auth middleware runs, it attaches - req.plan, req.free_usage, controller uses it 

/* Request comes
↓
req.auth() → gives userId + has()
↓
Check premium plan
↓
Get full user data
↓
If free + has usage → keep usage
Else → set usage = 0
↓
Set req.plan
↓
next() → go to actual API*/