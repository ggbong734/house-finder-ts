import { isRequiredArgument } from "graphql";
import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
// import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
    CreateHouseMutation,
    CreateHouseMutationVariables,
} from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

// start here l11 5/16/2022
// ok

const SIGNATURE_MUTATION = gql`
mutation CreateSignatureMutation {
    createImageSignature{
        signature
        timestamp
    }
}`;

const CREATE_HOUSE_MUTATION = gql`
    mutation CreateHouseMutation($input: HouseInput!) {
        createHouse(input: $input) {
            id
        }
    }
`;


interface IUploadImageResponse {
    secure_url: string;
}

async function uploadImage(image: File, signature: string, timestamp: number): Promise<IUploadImageResponse> {
    const url = `https:/api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

    const response = await fetch(url, {
        method: "post",
        body: formData
    });
    return response.json();
}

interface IFormData {
    address: string;
    latitude: number;
    longitude: number;
    bedrooms: string;
    image: FileList;
}

interface IProps { }

export default function HouseForm({ }: IProps) {
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>();
    const { register, handleSubmit, setValue, errors, watch } = useForm<IFormData>({
        defaultValues: {}
    });
    const address = watch("address");
    //create use mutation hook
    const [createSignature] = useMutation<CreateSignatureMutation>(SIGNATURE_MUTATION)
    const [createHouse] = useMutation<
        CreateHouseMutation,
        CreateHouseMutationVariables>(CREATE_HOUSE_MUTATION);

    useEffect(() => {
        register({ name: "address" }, { required: "Please enter your addrress" });
        register({ name: "latitude" }, { required: true, min: -90, max: 90 });
        register({ name: "longitude" }, { required: true, min: -180, max: 180 });
    }, [register])

    const handleCreate = async (data: IFormData) => {
        //call mutation and get signature and timestamp back (image signature)
        const { data: signatureData } = await createSignature();
        if (signatureData) {
            const { signature, timestamp } = signatureData.createImageSignature;
            const imageData = await uploadImage(data.image[0], signature, timestamp);
            // const imageUrl = imageData.secure_url;
            const { data: houseData } = await createHouse({
                variables: {
                    input: {
                        address: data.address,
                        image: imageData.secure_url,
                        coordinates: {
                            latitude: data.latitude,
                            longitude: data.longitude
                        },
                        bedrooms: parseInt(data.bedrooms, 10),
                    },
                },
            });
            if (houseData?.createHouse) {
                router.push(`/houses/${houseData.createHouse.id}`);
            } else {
                // should have validated data and made sure user is authenticated
                // so if any error we can show it here maybe a popup or toast
            }
        }

    };

    const onSubmit = (data: IFormData) => {
        setSubmitting(true);
        handleCreate(data);
    }

    return (
        <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-xl">Add a New House</h1>
            <div className="mt-4">
                <label htmlFor="search" className="block">
                    Search for your address
                </label>
                <SearchBox onSelectAddress={(address, latitude, longitude) => {
                    setValue("address", address);
                    setValue("latitude", latitude);
                    setValue("longitude", longitude);
                }}
                    defaultValue=""
                />
                {errors.address && <p>errors.address.message</p>}
            </div>

            {address && (<>
                <div className="mt-4">
                    <label htmlFor="image" className="p-4 border-dashed border-4 border-gray-600
                block cursor-pointer"> Click to add image (16:9)
                    </label>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={register({
                            validate: (fileList: FileList) => {
                                if (fileList.length === 1) return true;
                                return "Please upload one file";
                            }
                        })}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            if (event?.target?.files?.[0]) {
                                const file = event.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setPreviewImage(reader.result as string);
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
                    {previewImage && (
                        <img src={previewImage}
                            className="mt-4 object-cover"
                            style={{ width: "576px", height: `${(9 / 16 * 576)}px` }}
                        />
                    )}
                    {errors.image && <p>{errors.image.message}</p>}
                </div>
                <div className="mt-4">
                    <label htmlFor="bedrooms" className="block">Beds</label>
                    <input id="bedrooms" name="bedrooms" type="number" className="p-2" ref={register(
                        {
                            required: "Please enter the number of bedrooms",
                            max: { value: 10, message: "Wooahh, too big of a house" },
                            min: { value: 1, message: "Must have at least 1 bedroom" },
                        })}
                    />
                    {errors.bedrooms && <p>{errors.bedrooms.message}</p>}
                </div>
                <div className="mt-4">
                    <button className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                        type="submit"
                        disabled={submitting}>
                        Save
                    </button>{" "}
                    <Link href="/">
                        <a href="">Cancel</a>
                    </Link>
                </div>
            </>)}
        </form>)
};
