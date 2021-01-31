# Social Network

This single-page full stack application is a social network on which users can sign up, say a little about themselves, and become friends with other users. <br>
The UI is built with React and the photo uploading feature made possible by the S3 from AWS. Cookies setting make it that the users do not need to log in every time they access the site, going directly to a home page where they can upload and edit a small biography. The friends tab show both people there are already friends with them and friend requests. Extra resources include a search field to find specific people, a chat feature built with Socket.io and a cross-site attack prevention through cookie reading. <br>

Server side wise there is Node.js, a database built with PostgreSQL and SES, the Simple Email Service from AWS that enables the users to reset their password. 

