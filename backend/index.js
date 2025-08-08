require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

app.use(express.static("dist"));

app.use(express.json());

app.use((request, response, next) => {
	const oldJson = response.json;

	response.json = (body) => {
		response.locals.body = body;
		return oldJson.call(response, body);
	};

	next();
});

morgan.token("bod", (req, res) => {
	return JSON.stringify(res.locals.body);
});

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :bod")
);

app.get("/", (request, response) => {
	response.send("<h1>HELLO!</h1>");
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((people) => {
		response.json(people);
	});
});

app.get("/info", (request, response) => {
    Person.find({}).then(people => {
	    const count = people.length
        
        response.send(`<p>Phonebook has info for ${count} people.</p>
            <p>${Date()}</p>
            `);    
    })

});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
	const body = request.body;

	// if (!body.name) {
	// 	return response.status(400).json({
	// 		error: "name is missing",
	// 	});
	// }
	// if (!body.number) {
	// 	return response.status(400).json({
	// 		error: "number is missing",
	// 	});
	// }

	// if(Object.values(people.map(p => p.name)).find(p => p.toLowerCase() === body.name.toLowerCase())) {
	//     return response.status(400).json({
	//         error:'name must be unique'
	//     })
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			response.json(savedPerson);
		})
		.catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const { name, number } = request.body;

	Person.findById(request.params.id).then((person) => {
		if (!person) {
			return response.status(404).end();
		}

		person.name = name;
		person.number = number;

		return person
			.save()
			.then((updatedPerson) => {
				response.json(updatedPerson);
			})
			.catch((error) => next(error));
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "Malformatted ID" });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
