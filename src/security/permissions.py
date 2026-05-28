class RolePermissions:
    @staticmethod
    def is_authorized(role: str, action: str) -> bool:
        """Check if a role is authorized to perform an action."""
        if role == "admin":
            return True
        return False
