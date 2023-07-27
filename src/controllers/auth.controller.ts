import { Request, Response } from "express";

export const signInView = (req: Request, res: Response) => {
  res
    .status(200)
    .render("auth/signIn", { layout: "./layouts/auth", title: "Sign in" });
};

export const signIn = (req: Request, res: Response) => {
  // if ok redirect
  // else return errors
  res.status(200).redirect("/");
};
