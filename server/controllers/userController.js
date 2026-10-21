import sql from "../configs/db.js"

export const getUserCreations = async(req, res) => {
    try {
        const {userId} = req.auth()
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC` //the result will be an array of objects 
        res.json({success: true, creations})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getPublishCreations = async(req, res) => {
    try {
        const creations = await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`
        res.json({success: true, creations})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
//this will be needed by our commuinty page, creations.map(...), those creations come from this api

export const toggleLikeCreations = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {id} = req.body //its a post id, means like/unlike post #5
        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`  //why [] bcz sql returns an array like [{id:5, likes:["user_111", "user_222"]}] but i only want first row so creations = {id:5, likes:["user_111", "user_222"]}
        if(!creation){
            return res.json({success: false, message: "Creation not found"})
        }
        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;
        if(currentLikes.includes(userIdStr)){      //unlike
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation unliked'
        } else {        //like
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation liked'
        }
        //current updatedLikes contains ["user_111","user_123"] but postgreSQL wants {"user_111","user_123"}
        const formattedArray = `{${updatedLikes.join(',')}}` //it becomes "{user_111,user_123}"
        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
        //database row changes for the specific if post ...befire likes={user_111}, after likes={user_111,user_123}
        res.json({success: true, message})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

/*Frontend
↓
POST /toggle-like-creations
↓
Send post id
↓
Backend finds post
↓
Check if user already liked
↓
If yes → remove user from likes
↓
If no → add user to likes
↓
Update database
↓
Return success
↓
Frontend updates heart color*/


