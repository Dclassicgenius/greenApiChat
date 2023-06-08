import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from "axios";
import { useState } from "react";
import { Chat } from "../Chat/Chat";

interface IFormInput {
  idInstance: string;
  apiTokenInstance: string;
  receiverPhone: string;
}

type StatInstance = {
  stateInstance: string;
};

export const LoginForm = () => {
  const [authorized, setAuthorized] = useState(false);
  const [authorizedData, setAuthorizedData] = useState({
    idInstance: "",
    apiTokenInstance: "",
    receiverPhone: "",
  });
  const [unauthorizedError, setUnauthorizedError] = useState(false);
  const { register, handleSubmit, formState, control } = useForm<IFormInput>({
    defaultValues: {
      idInstance: "",
      apiTokenInstance: "",
      receiverPhone: "",
    },
  });

  const { errors } = formState;

  const checkInstance = async (
    idInstance: string,
    apiTokenInstance: string
  ) => {
    const apiURL = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;
    try {
      const response = await axios.get<StatInstance>(apiURL);
      return response.data.stateInstance;
    } catch (error) {
      console.error("Error fetching state instance:", error);
      return "error";
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    const stateInstance = await checkInstance(
      data.idInstance,
      data.apiTokenInstance
    );

    if (stateInstance === "authorized") {
      console.log("user authorized");
      setAuthorized(true);
      setUnauthorizedError(false);
      setAuthorizedData(data);
    } else {
      setUnauthorizedError(true);
    }
  };

  return (
    <>
      {authorized ? (
        <Chat
          idInstance={authorizedData.idInstance}
          apiTokenInstance={authorizedData.apiTokenInstance}
          receiverPhone={authorizedData.receiverPhone}
        />
      ) : (
        <>
          <Typography
            variant="h3"
            width={500}
            sx={{ mx: "auto", py: 2, textAlign: "center" }}
          >
            New Chat
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} width={500} sx={{ mx: "auto" }}>
              <TextField
                label="Id"
                type="text"
                {...register("idInstance", {
                  required: "idInstance is require",
                })}
                error={!!errors.idInstance}
                helperText={errors.idInstance?.message}
              />
              <TextField
                label="API Token"
                type="text"
                {...register("apiTokenInstance", {
                  required: "apiTokenInstance is require",
                })}
                error={!!errors.apiTokenInstance}
                helperText={errors.apiTokenInstance?.message}
              />
              <TextField
                label="Receiver's Phone Number"
                type="text"
                {...register("receiverPhone", {
                  required: "receiverPhone is require",
                })}
                error={!!errors.receiverPhone}
                helperText={errors.receiverPhone?.message}
              />
              {unauthorizedError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  You are not authorized. Please check your Id and API Token.
                </Alert>
              )}
              <Button type="submit" variant="contained" color="primary">
                Create New Chat
              </Button>
            </Stack>
          </form>
        </>
      )}

      <DevTool control={control} />
    </>
  );
};
