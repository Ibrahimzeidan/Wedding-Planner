from typing import Generic, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class AdminResponse(BaseModel, Generic[DataT]):
    success: bool = True
    message: str = "Action completed successfully"
    data: DataT


def ok(data, message: str = "Action completed successfully") -> dict:
    return {"success": True, "message": message, "data": data}
