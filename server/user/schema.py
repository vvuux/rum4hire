import graphene
from graphene_django import DjangoObjectType
from graphql_jwt.refresh_token.models import RefreshToken
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations

from .models import HouseOwner


class HouseOwnerType(DjangoObjectType):
    class Meta:
        model = HouseOwner


class RefreshTokenType(DjangoObjectType):
    is_expired = graphene.Boolean(source="is_expired")
    
    class Meta:
        model = RefreshToken


class Query(UserQuery, MeQuery, graphene.ObjectType):
    refresh_token_expiration = graphene.Field(
        RefreshTokenType,
        refresh_token=graphene.String()
    )

    def resolve_refresh_token_expiration(root, info, refresh_token):
        try:
            return RefreshToken.objects.get(token=refresh_token)
        except Exception as e:
            pass


class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verifyAccount = mutations.VerifyAccount.Field()
    token_auth = mutations.ObtainJSONWebToken.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_password_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()
    password_change = mutations.PasswordChange.Field()
    verifyToken = mutations.VerifyToken.Field()
    revokeToken = mutations.RevokeToken.Field()
    refreshToken = mutations.RefreshToken.Field()


class Mutation(AuthMutation, graphene.ObjectType):
    pass