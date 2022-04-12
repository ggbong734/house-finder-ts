// import { GetServerSideProps, NextApiRequest } from "next";
// import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import HouseForm from "src/components/houseForm";

import { GetServerSideProps, NextApiRequest } from "next";
import { loadIdToken } from "src/auth/firebaseAdmin";

export default function Add() {
  return <Layout main={<HouseForm />} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);
  if (!uid) { // if no user id they are not authenticated so we push them to the auth page
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }
  return { props: {} };
}
