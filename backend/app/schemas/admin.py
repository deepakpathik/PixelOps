from pydantic import BaseModel

class FraudResolveRequest(BaseModel):
    action: str
