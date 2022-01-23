

describe("Testando endpoints da API - Cypress", () => {

    describe("Rotas - Inicio", () => {

        it("Home - API Online", () => {
            cy.request(`${Cypress.env('url')}`)
                 .then((response) => {
                        expect(response.body).to.have.property('response', 'API Online');
            })
      });
    })

    describe("Rotas - Usuário", () => {
        
        it("Usuário - Falta de dados para autenticação de usuário", () => {
            cy.request({
                method: 'POST',
                url : Cypress.env('url') + 'users',
                failOnStatusCode: false,
                body: {
                    "email": Cypress.env('login'),
                } 
            }).then((response) => {
                expect(response.status).to.eq(422)
                expect(response.body).to.have.property('status', 0);
                expect(response.body).to.have.property('response', 'A senha é obrigatória!');
                
            });
        });

        it("Usuário - Token não enviado", () => {
            cy.request({
                method: 'POST',
                url : Cypress.env('url') + 'users/create',
                headers: {
                    "authorization": ''
                },
                failOnStatusCode: false,
                body: {
                    "email": Cypress.env('login'),
                }
            }).then((response) => {
                expect(response.status).to.eq(401)
                expect(response.body).to.have.property('status', 0);
                expect(response.body).to.have.property('response', 'Necessário enviar token para validação');
                
            });
        });

        it("Usuário - Autenticação de usuário", () => {
            cy.request({
                method: 'POST',
                url : Cypress.env('url') + 'users',
                body: {
                    "email": Cypress.env('login'),
                    "password": Cypress.env('password')
                }
            }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Usuário logado com sucesso');
                    Cypress.env('token', 'Bearer ' + response.body.token);
                    cy.log(Cypress.env('token'));
            });
        });

        it("Usuário - Criação de usuário", () => {
                cy.request({
                    method: 'POST',
                    url : Cypress.env('url') + 'users/create',
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: {
                        "name": "New Test",
                        "email": "newtest@test.com",
                        "password": "newtest123"
                    }
                }).then((response) => {
                            // expect(response.body).to.have.property('status', 1);
                            // Cypress.env('token', 'Bearer ' + response.body.token);
                            cy.log(response.body.response);
                });
        });

        it("Usuário - Tentativa  de criação de usuário com mesmo email", () => {
            cy.request({
                method: 'POST',
                url : Cypress.env('url') + 'users/create',
                failOnStatusCode: false,
                headers: {
                    "authorization": Cypress.env('token')
                },
                body: {
                    "name": "New Test",
                    "email": "newtest@test.com",
                    "password": "newtest123"
                }
            }).then((response) => {
                expect(response.status).to.eq(409)
                expect(response.body).to.have.property('status', 0);
                expect(response.body).to.have.property('response', "Usuário já existe. Por favor faça login!");
                        
                        cy.log(response.body.response);
            });
        });
    });

    describe("Rotas - Aulas", () => {

        describe("Aula - Criação de aulas", () => {
            it("Token invalido", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": 'batata'
                    },
                }).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', "Token invalido!!");
                });
            });

            it("Criando aulas com todos os parametros", () => {
                const body = [{
                    "name": "Aula de teste 1 - Cypress",
                    "description": "Uma aula super interessante sobre cypress 1",
                    "video": "https://www.youtube.com/watch?v=1PTs1mqrToM",
                    "data_init": "2022-01-01",
                    "data_end": "2022-02-20"
                },{
                    "name": "Aula de teste 2 - Cypress",
                    "description": "Uma aula super interessante sobre cypress 2",
                    "video": "https://www.youtube.com/watch?v=1PTs1mqrToM",
                    "data_init": "2022-01-30",
                    "data_end": "2022-02-31"
                }];
                cy.request({
                    method: 'POST',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: body[0]
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Aula criado com sucesso!');
                    cy.log(response.body.response);
                });
                cy.request({
                    method: 'POST',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: body[1]
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Aula criado com sucesso!');
                    cy.log(response.body.response);
                });
            });

            it("Usuário - Falta de dados para criação de usuário", () => {
                cy.request({
                    method: 'POST',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: {
                        "data_init": "2022-01-30",
                        "data_end": "2022-02-31"
                    } 
                }).then((response) => {
                    expect(response.status).to.eq(422)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', 'O nome é obrigatório!');
                });
            });
        });

        describe("Aula - Buscar aulas", () => {
            
            it("Token invalido", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": 'batata'
                    },
                }).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', "Token invalido!!");
                });
            });

            it("Buscando aulas sem filtro", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response');
                    cy.log(response.body.response);
                });
            });

            it("Buscando aulas com filtro", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}&name=Aula de teste 1 - Cypress`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response');
                    Cypress.env('id_class', response.body.response[0].id);
                    cy.log(Cypress.env('id_class'));
                });
            });

            it("Buscando detalhes das aulas com id invalido", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes/aaaaaa`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(422)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', 'ID invalido!');
                    cy.log(response.body.response);
                });
            });

            it("Buscando detalhes das aulas com id valido", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes/${Cypress.env('id_class')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response');
                    cy.log(response.body.response.name);
                });
            });


            it("Buscando detalhes das aulas com id valido, porém sem cadastro no banco", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes/61ecaa169415d2961680b0b7`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Nenhuma aula encontrada com esse ID!');
                    cy.log(response.body.response.name);
                });
            });

        });

        describe("Aula - Atualização de dados", () => {

            it("Token invalido", () => {
                cy.request({
                    method: 'PUT',
                    url : Cypress.env('url') + `classes/`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": 'batata'
                    },
                }).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', "Token invalido!!");
                });
            });

            it("Tentando atualizar aula com id inexistente", () => {
                cy.request({
                    method: 'PUT',
                    url : Cypress.env('url') + `classes/`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: {
                        "id": "61ecaa169415d2961680b0b7",
                        "description": 'Nova descrição'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Nenhuma aula encontrada com esse ID!');
                    cy.log(response.body.response.name);
                });
            });

            it("Atualizando dados de uma aula", () => {
                cy.request({
                    method: 'PUT',
                    url : Cypress.env('url') + `classes/`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: {
                        "id": Cypress.env('id_class'),
                        "description": 'Teste de atualização de descrição - cypress'
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', `Aula ${Cypress.env('id_class')} atualizada com sucesso!`);
                });
            });

            it("Tentando atualizar uma aula sem passar nenhum dado para ser atualizado", () => {
                cy.request({
                    method: 'PUT',
                    url : Cypress.env('url') + `classes/`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                    body: {
                        "id": Cypress.env('id_class'),
                    }
                }).then((response) => {
                    expect(response.status).to.eq(422)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', `Nenhuma dado a ser atualizado!`);
                });
            });

        });

        describe("Aula - Comentários", () => {

            describe("Aula - Criando comentários", () => {
                it("Token invalido", () => {
                    cy.request({
                        method: 'POST',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": 'batata'
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(401)
                        expect(response.body).to.have.property('status', 0);
                        expect(response.body).to.have.property('response', "Token invalido!!");
                    });
                });

                it("Criando commentários corretamente", () => {
                    const body = [{
                        "id_class": Cypress.env('id_class'),
                        "comment": "Comentário gerado pelo cypress 1"
                    },{
                        "id_class": Cypress.env('id_class'),
                        "comment": "Comentário gerado pelo cypress 2"
                    }];
                    cy.request({
                        method: 'POST',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                        body: body[0]
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('status', 1);
                        expect(response.body).to.have.property('response', 'Comentário criado com sucesso!');
                        cy.log(response.body.response);
                    });
                    cy.request({
                        method: 'POST',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                        body: body[1]
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('status', 1);
                        expect(response.body).to.have.property('response', 'Comentário criado com sucesso!');
                        cy.log(response.body.response);
                    });
                });

                it("Tentando criar comentário sem o comentário", () => {
                    const body = {
                        "id_class": Cypress.env('id_class'),
                    };
                    cy.request({
                        method: 'POST',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                        body: body
                    }).then((response) => {
                        expect(response.status).to.eq(422)
                        expect(response.body).to.have.property('status', 0);
                        expect(response.body).to.have.property('response', 'O comentário é obrigatório!');
                        cy.log(response.body.response);
                    });
                });

            });

            describe("Buscando comentários", () => {

                it("Token invalido", () => {
                    cy.request({
                        method: 'GET',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": 'batata'
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(401)
                        expect(response.body).to.have.property('status', 0);
                        expect(response.body).to.have.property('response', "Token invalido!!");
                    });
                });

                it("Buscando comentários", () => {
                    cy.request({
                        method: 'GET',
                        url : Cypress.env('url') + `classes/comments`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('status', 1);
                        expect(response.body).to.have.property('response');
                        Cypress.env('id_comment', response.body.response[0].id);
                        cy.log(Cypress.env('id_comment'));
                    });
                });
            });

            describe("Deletando comentários", () => {

                it("Token invalido", () => {
                    cy.request({
                        method: 'DELETE',
                        url : Cypress.env('url') + `classes/comments/${Cypress.env('id_comment')}`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": 'batata'
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(401)
                        expect(response.body).to.have.property('status', 0);
                        expect(response.body).to.have.property('response', "Token invalido!!");
                    });
                });

                it("Tentando deletar comentário com id invalido", () => {
                    cy.request({
                        method: 'DELETE',
                        url : Cypress.env('url') + `classes/comments/adsadassedasdas`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(422)
                        expect(response.body).to.have.property('status', 0);
                        expect(response.body).to.have.property('response', "ID invalido!");
                    });
                });

                it("Tentando deletar comentário com id inesxistente", () => {
                    cy.request({
                        method: 'DELETE',
                        url : Cypress.env('url') + `classes/comments/61eb7b2a503a91d154a83514`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('status', 1);
                        expect(response.body).to.have.property('response', "Nenhum comentário encontrado com esse ID!");
                    });
                });

                it("Deletando um comentário", () => {
                    cy.request({
                        method: 'DELETE',
                        url : Cypress.env('url') + `classes/comments/${Cypress.env('id_comment')}`,
                        failOnStatusCode: false,
                        headers: {
                            "authorization": Cypress.env('token')
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200)
                        expect(response.body).to.have.property('status', 1);
                        expect(response.body).to.have.property('response', `Comentário ${Cypress.env('id_comment')} deletada com sucesso!`);
                    });
                });
            });

    
        });

        describe("Aula - Deletando aulas", () => {

            it("Token inválido", () => {
                cy.request({
                    method: 'GET',
                    url : Cypress.env('url') + `classes?page=${Cypress.env('page')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": 'batata'
                    },
                }).then((response) => {
                    expect(response.status).to.eq(401)
                    expect(response.body).to.have.property('status', 0);
                    expect(response.body).to.have.property('response', "Token invalido!!");
                });
            });

            it("Tentando deletar aula com id inexistente", () => {
                cy.request({
                    method: 'DELETE',
                    url : Cypress.env('url') + `classes/61ecaa169415d2961680b0b7`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', 'Nenhuma aula encontrada com esse ID!');
                    cy.log(response.body.response.name);
                });
            });

            it("Deletando aula", () => {
                cy.request({
                    method: 'DELETE',
                    url : Cypress.env('url') + `classes/${Cypress.env('id_class')}`,
                    failOnStatusCode: false,
                    headers: {
                        "authorization": Cypress.env('token')
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body).to.have.property('status', 1);
                    expect(response.body).to.have.property('response', `Aula ${Cypress.env('id_class')} deletada com sucesso!`);
                    cy.log(response.body.response.name);
                });
            });

        });

    });

});