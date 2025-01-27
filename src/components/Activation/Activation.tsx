"use client";
import React, { useState, useEffect, Suspense, FC } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/hooks/useUserApi";
import {useTranslations} from 'next-intl';
import { updateUser } from "@/hooks/useUserApi";

interface GetParamsProps {
  setEmailUser: (email: string) => void;
}

export const GetParams: FC<GetParamsProps> = ({ setEmailUser }) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    setEmailUser(email || "");
  }, [setEmailUser]);
  return null;
};

export interface IDataUser {
  _id: string;
  email: string;
  name: string;
  password: string;
  activationCode: number;
  active: boolean;
  role: string;
  token?: string;
}

interface IMessage {
    type: string;
    text: string;
    }

const Activation = () => {
    const router = useRouter();
    const t = useTranslations('Activation');
  const [emailUser, setEmailUser] = useState<string>("");
  const [dataUser, setDataUser] = useState<IDataUser | null>(null);
  const [userCode, setUserCode] = useState<number>(0);
  const [message, setMessage] = useState<IMessage|null>(null);

  useEffect(() => {
    if (emailUser !== "") {
      //console.log('emailUser:..', emailUser)
      getDataUser(emailUser);
    }
  }, [emailUser]);

  const getDataUser = async (email: string) => {
    //console.log('emailUser:..', email)
    try {
      const result = await getUser(email);
      console.log("result getDataUser:..", result);
      const { _id } = result;
      if (_id) {
        setDataUser(result);
      }
    } catch (error) {
      console.log("error getDataUser:..", error);
    }
  };

    const verifyCode = async () => {
        if (dataUser) {
        const { activationCode } = dataUser;
        if (activationCode === userCode) {
            //console.log("User is active:..", _id);
            setMessage({ type: "success", text: t('successMsg') });
            dataUser.active = true;
            await updateUser(dataUser);
            setTimeout(() => {
            router.push("/login");
            }, 3000);
        } else {
            //console.log("User is not active:..", _id);
            setMessage({ type: "error", text: t('errorMsg') });
        }
        }
    };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetParams setEmailUser={setEmailUser} />
      </Suspense>
      {emailUser === "" && <div>No Email User</div>}
      {dataUser && (
        <div className="flex justify-center mt-8">
          <div className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{t('title')}</h2>
              <p>
                {t('description')} 
              </p>
              <input
                type="number"
                placeholder="Type here"
                value={String(userCode)}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setUserCode(Number(e.target.value))}
              />
              {message?.type==='error' && (
                <div className="alert alert-error mt-4">
                  <div className="flex-1">
                    <label>{message.text}</label>
                  </div>
                </div>
              )}
                {message?.type==='success' && (
                    <div className="alert alert-success mt-4">
                    <div className="flex-1">
                        <label>{message.text}</label>
                    </div>
                    </div>
                )}
              <div className="card-actions justify-end">
                <button className="btn btn-primary" onClick={verifyCode}>{t('button')}</button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activation;
