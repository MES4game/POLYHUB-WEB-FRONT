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

const RegisterFormComp: FC = (): ReactNode => {
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
                        Inscription
                    </CardTitle>

                    <CardDescription>
                        Inscrivez-vous pour sauvegarder vos préférences
                    </CardDescription>

                </CardHeader>

                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="pseudo">
                                    Identifiant
                                </FieldLabel>

                                <Input
                                    id="pseudo"
                                    type="text"
                                    required
                                />
                            </Field>
                            
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Mot de passe
                                </FieldLabel>

                                <Input
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
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterFormComp;
