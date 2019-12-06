# SFIA-SE-Backend-Roles
The Backend Microservice used to GET request SFIA information for responsibilities and skills

/getRoleById?id={id} - gets all ids of skills required for a role in a json format
/postrole -  uploads a new role to the database with all skill ids
/putrole - updates the required skills for a role in the database
/deleterole?id={id} - deletes a role in the database via its id
