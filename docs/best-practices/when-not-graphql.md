Use GraphQL everywhere where you interact with models.
Use REST where you have a specific requirement.
Don't try to use GraphQL in the places where it doesn't fit - for example for file uploads.
GraphQL is perfectly fit for models, not files. 
You can use classic REST-like queries to implement upload functionality in your app.
Everything has its own place, if you'll try to make an absolute consistency in everything - you'll endup with a poor design and implementation. 