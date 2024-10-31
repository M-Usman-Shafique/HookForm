import { DevTool } from "@hookform/devtools";
import axios from "axios";
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";

let count = 0;

export default function Form() {
  const form = useForm({
    defaultValues: async () => {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1"
      );
      const data = response.data;
      return {
        username: data.username,
        email: data.email,
        social: {
          facebook: "",
          twitter: "",
        },
        contacts: ["", ""],
        skills: [{ skillName: "" }],
      };
    },
  });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control,
  });

  count++;

  const onSubmit = (data) => {
    console.log(data);
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
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook")} />
        </div>

        <div className="form-control">
          <label htmlFor="twitter">Facebook</label>
          <input type="text" id="twitter" {...register("social.twitter")} />
        </div>

        <div className="form-control">
          <label htmlFor="mobile-phone">Mobile No.</label>
          <input type="text" id="mobile-phone" {...register("contacts[0]")} />
        </div>

        <div className="form-control">
          <label htmlFor="other">Other Ph.</label>
          <input type="text" id="other" {...register("contacts[1]")} />
        </div>

        <div>
          <label>List of Skills</label>
          <div>
            {fields.map((field, index) => (
              <div className="form-control" key={field.id}>
                <input type="text" {...register(`skills.${index}.skillName`)} />
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)}>
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => append({ skill: "" })}>
              Add Skill
            </button>
          </div>
        </div>

        <button>Submit</button>
        <DevTool control={control} />
      </form>
    </div>
  );
}
