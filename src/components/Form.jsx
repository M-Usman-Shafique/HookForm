import { DevTool } from "@hookform/devtools";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

let count = 0;

const schema = yup.object({
  username: yup.string().required("Yup username is required"),
  email: yup
    .string()
    .email("Invalid yup email")
    .required("Yup email is required"),
});

export default function Form() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
    resolver: yupResolver(schema)
  });
  const { register, control, handleSubmit, formState, getValues, reset } = form;
  const {
    errors,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    isSubmitSuccessful,
    submitCount,
  } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  count++;

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleGetValues = () => {
    console.log(getValues());
  };
  return (
    <div>
      <h1>Basic Form ({count / 2})</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: {
                value: true,
                message: "Username is required",
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              pattern: {
                value:
                  /^[a-zA-Z0-9. !#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid Email",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email"
                  );
                },
                notBlacklisted: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "This domain isn't supported"
                  );
                },
                emailAvailable: async (fieldValue) => {
                  const response = await axios.get(
                    `https://jsonplaceholder.typicode.com/users?email=${fieldValue}`
                  );
                  const data = response.data;
                  return data.length === 0 || "Email already exists";
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
        <button type="button" onClick={handleGetValues}>
          Get Values
        </button>
        <DevTool control={control} />
      </form>
    </div>
  );
}
