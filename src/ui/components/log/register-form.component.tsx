import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
    FC,
    ReactNode,
    useEffect,
} from "react";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { registerUser } from "@/api/user.api";

const RegisterFormComp: FC = (): ReactNode => {
    const { register, handleSubmit, reset: _reset } = useForm<IFormInput>();

    interface IFormInput {
        pseudo         : string;
        email          : string;
        firstname      : string;
        lastname       : string;
        password       : string;
        confirmpassword: string;
    }

    useEffect(() => {
        console.log("Loaded: LoginFormComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: LoginFormComp");
    });

    const onSubmit: SubmitHandler<IFormInput> = async (data: IFormInput) => {
        if (data.password !== data.confirmpassword) {
            alert("Les mots de passe ne correspondent pas.");

            return;
        }

        try {
            await registerUser(data.pseudo, data.email, data.firstname, data.lastname, data.password);
            alert("Un email vous a été envoyé pour confirmer votre inscription.");
            window.location.href = "/login";
        }
        catch(_error: unknown) {
            alert("Échec de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 overflow-y-auto">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>
                        Inscription
                    </CardTitle>

                    <CardDescription>
                        Inscrivez-vous pour sauvegarder vos préférences
                    </CardDescription>

                </CardHeader>

                <CardContent className="max-h-[80vh] overflow-y-auto">
                    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="firstname">
                                    Prénom
                                </FieldLabel>

                                <Input
                                    {...register("firstname")}
                                    id="firstname"
                                    type="text"
                                    required
                                />
                            </Field>
                            
                            <Field>
                                <FieldLabel htmlFor="lastname">
                                    Nom
                                </FieldLabel>

                                <Input
                                    {...register("lastname")}
                                    id="lastname"
                                    type="text"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="pseudo">
                                    Identifiant
                                </FieldLabel>

                                <Input
                                    {...register("pseudo")}
                                    id="pseudo"
                                    type="text"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">
                                    Email
                                </FieldLabel>

                                <Input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    required
                                />
                            </Field>
                            
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Mot de passe
                                </FieldLabel>

                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="confirmpassword">
                                    Confirmez le mot de passe
                                </FieldLabel>

                                <Input
                                    {...register("confirmpassword")}
                                    id="password"
                                    type="password"
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit">
                                    S'inscrire
                                </Button>

                                <FieldDescription className="text-center">
                                    Vous avez déjà un compte?
                                    {" "}

                                    <Link to="/login">
                                        Se connecter
                                    </Link>
                                </FieldDescription>
                                
                                <Link
                                    to="/"
                                    className="text-center"
                                >
                                    Continuer sans se connecter
                                </Link>
                            </Field>
                        </FieldGroup>
                    </form>
                    
                    <div className="h-4" />
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterFormComp;
