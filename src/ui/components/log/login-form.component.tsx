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
import { loginUser } from "@/api/user.api";
import { useGeneralVars } from "@/shared/contexts/common/general.context";
import {
    FC,
    ReactNode,
    useEffect,
} from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

const LoginFormComp: FC = (): ReactNode => {
    interface IFormInput {
        login   : string;
        password: string;
    }

    const context = useGeneralVars();
    const { register, handleSubmit, reset: _reset } = useForm<IFormInput>();

    const handleLogin: SubmitHandler<IFormInput> = async (data) => {
        try {
            context.token.current = (await loginUser(data.login, data.password)).token;
            window.location.href = "/";
        }
        catch(_error:unknown) {
            alert("Connexion échouée. Veuillez vérifier vos identifiants.");
        }
    };

    useEffect(() => {
        console.log("Loaded: LoginFormComp");
    }, []);
    
    useEffect(() => {
        console.log("Rendered: LoginFormComp");
    });

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Connexion
                    </CardTitle>

                    <CardDescription>
                        Connectez-vous pour récupérer vos préférences
                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <form onSubmit={(e) => { void handleSubmit(handleLogin)(e); }}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="pseudo">
                                    Identifiant
                                </FieldLabel>

                                <Input
                                    {...register("login")}
                                    id="pseudo"
                                    type="text"
                                    required
                                />
                            </Field>
                            
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Mot de passe
                                    </FieldLabel>

                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Mot de passe oublié?
                                    </a>
                                </div>

                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    required
                                />
                            </Field>

                            <Field>
                                <Button type="submit">
                                    Se connecter
                                </Button>

                                <FieldDescription className="text-center">
                                    Vous n'avez pas de compte?
                                    {" "}

                                    <Link to="/register">
                                        Créer un compte
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
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginFormComp;
