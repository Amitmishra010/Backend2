import {v2 as cloudinary} from "cloudinary"


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
const deleteFromCloudinary=async (public_id,resourceType)=>{
    try {
        if(!public_id) {throw new Error("public id is not found")};
        if(!resourceType){
            throw new Error("resource type is not found");
        }
        
        //delete on cloudinary
        const response=await cloudinary.uploader.destroy(public_id,{
            resource_type:resourceType
        })
        
        
        if(response.result==="ok"){
            console.log("file is successfully deleted")
            return response;
        }
        if(response.result==="not found"){
            console.log("file is already deleted")
            return response;
        }
        throw new Error("something wrong happend");
        
    } catch (error) {
        console.log("cloudinary deletion error",error.message);
       throw error;
    }
}
export {deleteFromCloudinary};