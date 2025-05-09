import mongoose from 'mongoose'
export const initializeMongoose = () =>{
  mongoose
  .connect(process.env.DATABASE_URL || "")
  .then(() => console.log('Connected to DB'))
  .catch(console.error)
}