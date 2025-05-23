class UserIdentity:
    def __init__(self):
        # Canonical lowercase username → role
        self.roles = {
            "dustin": "owner",   # 👑 Full control
            "atlas": "admin",    # 🛡️ Operational-level admin
            "guest": "guest"     # 🔒 Default access
        }

    def get_role(self, username):
        """
        Return the role associated with the given username.
        Defaults to 'guest' if not found.
        """
        return self.roles.get(username.lower(), "guest")