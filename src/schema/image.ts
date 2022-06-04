import {
  ObjectType,
  Field,
  Int,
  Resolver,
  Mutation,
  Authorized,
} from "type-graphql";
const cloudinary = require("cloudinary").v2;

//what is returned from the mutation (get request in a RESTful route, mutation is like a POST or PUT)

@ObjectType()
class ImageSignature {
  @Field((_type) => String)
  signature!: string; // bang is needed to avoid declaration error

  @Field((_type) => Int)
  timestamp!: number;
}

//resolver is where we define query and mutation
export class ImageResolver {
  @Authorized() // only returns if user if authenticated
  @Mutation((_returns) => ImageSignature)
  createImageSignature(): ImageSignature {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature: string = cloudinary.utils.api_sign_request(
      {
        timestamp,
      },
      process.env.CLOUDINARY_SECRET
    );
    return { timestamp, signature };
  }
}
