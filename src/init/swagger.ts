const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'TCG Anime API with Swagger',
            version: '0.1.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
        },
        servers: [
            {
                url: 'http://localhost:8000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        admin: { type: 'boolean' },
                        victories: { type: 'integer' },
                        defeats: { type: 'integer' },
                        profile_picture: { type: 'string', nullable: true },
                    },
                },
                Archetype: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                    },
                    required: ['id', 'name', 'created_at', 'updated_at'],
                    example: {
                        id: 1,
                        name: 'ArchetypeName',
                        created_at: '2024-01-01T12:00:00.000Z',
                        updated_at: '2024-01-01T12:30:00.000Z',
                    },
                },
                Card: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        card_type: { type: 'string' },
                        type: { type: 'array', items: { type: 'string' } },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' },
                        effect: { type: 'string' },
                        image: { type: 'string' },
                        archetypes: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Archetype',
                            },
                        },
                        limited: { type: 'integer' },
                    },
                    required: [
                        'id',
                        'name',
                        'description',
                        'card_type',
                        'type',
                        'created_at',
                        'updated_at',
                        'limited',
                    ],
                    example: {
                        id: 1,
                        name: 'CardName',
                        description: 'Card Description',
                        card_type: 'Type',
                        type: ['Type1', 'Type2'],
                        created_at: '2024-01-01T12:00:00.000Z',
                        updated_at: '2024-01-01T12:30:00.000Z',
                        effect: 'Card Effect',
                        image: 'image-url.jpg',
                        archetypes: [1, 2, 3],
                        limited: 0,
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            { bearerAuth: [] },
        ],
    },
    apis: ['./src/models/*.model.ts', './src/routes/normal/*/*.routes.ts', './src/routes/admin/*/*.routes.ts'],
};

export default swaggerOptions;