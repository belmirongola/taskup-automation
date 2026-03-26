# TaskUp API Extraction Report
Generated: 2026-03-26T07:01:48.374Z

## Endpoints Encontrados: 16

### POST /auth/v1/token
- Statuses: 200
- Secção: login

### GET /rest/v1/users
- Statuses: 200
- Secção: login

### GET /dashboard
- Statuses: 200
- Secção: login

### GET /projectos
- Statuses: 200
- Secção: login

### GET /guia
- Statuses: 200
- Secção: login

### GET /configuracoes
- Statuses: 200
- Secção: login

### GET /reunioes
- Statuses: 200
- Secção: login

### GET /calendario
- Statuses: 200
- Secção: login

### GET /colaboradores
- Statuses: 200
- Secção: login

### GET /kanban
- Statuses: 200
- Secção: login

### GET /tarefas
- Statuses: 200
- Secção: login

### HEAD /rest/v1/notificacoes
- Statuses: 200
- Secção: login

### HEAD, GET /rest/v1/tarefas
- Statuses: 200
- Secção: login

### HEAD, GET /rest/v1/projectos
- Statuses: 200
- Secção: login

### GET /storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png
- Statuses: 200
- Secção: dashboard

### GET /login
- Statuses: 307
- Secção: task-detail


## Detalhe Completo

---
### POST /auth/v1/token?grant_type=password
- Section: login
- Status: 200
- Request Body:
```json
{
  "email": "belmirongola@gmail.com",
  "password": "MarcaDigital2026!",
  "gotrue_meta_security": {}
}
```
- Response:
```json
{
  "access_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6ImMyODQ5M2ViLTgzNTMtNDVhYS05YTQ0LTFiMzAyNjhjZTMwOCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2xndmdydHFjaWVucnF1Ym54YXFzLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0OWI4NTYxZC0zMWM3LTRmOWYtYTIzNC1hZjE2YjUwNGU1ZWIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc0NTEyMDczLCJpYXQiOjE3NzQ1MDg0NzMsImVtYWlsIjoiYmVsbWlyb25nb2xhQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWxfdmVyaWZpZWQiOnRydWV9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc0NTA4NDczfV0sInNlc3Npb25faWQiOiI1ZmNlZjdmNy1jZTQ5LTQyN2EtYTZlYS03NmExNWUwNjkyOTEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.OWji8q1cDQX7IVgXaehwWLjwLuCmkxRtxL4bcWgUBakyxOhfB8PbTD0OruF7ha2Sd4-0DMAGx9Lom5abB4Devw",
  "token_type": "bearer",
  "expires_in": 3600,
  "expires_at": 1774512073,
  "refresh_token": "p3gdxigj5uo6",
  "user": {
    "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
    "aud": "authenticated",
    "role": "authenticated",
    "email": "belmirongola@gmail.com",
    "email_confirmed_at": "2026-03-18T21:46:13.564102Z",
    "phone": "",
    "confirmed_at": "2026-03-18T21:46:13.564102Z",
    "last_sign_in_at": "2026-03-26T07:01:13.605759869Z",
    "app_metadata": {
      "provider": "email",
      "providers": [
        "email"
      ]
    },
    "user_metadata": {
      "email_verified": true
    },
    "identities": [
      {
        "identity_id": "9588edfd-5bbf-417b-af43-4acc24359c1c",
        "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
        "user_id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
        "identity_data": {
          "email": "belmirongola@gmail.com",
          "email_verified": false,
          "phone_verified": false,
          "sub": "49b8561d-31c7-4f9f-a234-af16b504e5eb"
        },
        "provider": "email",
        "last_sign_in_at": "2026-03-18T21:46:13.562731Z",
        "created_at": "2026-03-18T21:46:13.562777Z",
        "updated_at": "2026-03-18T21:46:13.562777Z",
        "email": "belmirongola@gmail.com"
      }
    ],
    "created_at": "2026-03-18T21:46:13.56165Z",
    "updated_at": "2026-03-26T07:01:13.609319Z",
    "is_anonymous": false
  },
  "weak_password": null
}
```

---
### GET /rest/v1/users?select=*&id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb
- Section: login
- Status: 200
- Response:
```json
{
  "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "nome": "Belmiro Ngola",
  "email": "belmirongola@gmail.com",
  "papel": "membro",
  "whatsapp_numero": "244930117059",
  "avatar_url": "https://lgvgrtqcienrqubnxaqs.supabase.co/storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png",
  "activo": true,
  "onboarding_concluido": false,
  "onboarding_concluido_em": null,
  "criado_em": "2026-03-18T21:46:45.919746+00:00",
  "actualizado_em": "2026-03-24T13:17:18.554143+00:00"
}
```

---
### GET /dashboard?_rsc=970e3
- Section: login
- Status: 200

---
### GET /rest/v1/users?select=*&id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb
- Section: login
- Status: 200
- Response:
```json
{
  "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "nome": "Belmiro Ngola",
  "email": "belmirongola@gmail.com",
  "papel": "membro",
  "whatsapp_numero": "244930117059",
  "avatar_url": "https://lgvgrtqcienrqubnxaqs.supabase.co/storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png",
  "activo": true,
  "onboarding_concluido": false,
  "onboarding_concluido_em": null,
  "criado_em": "2026-03-18T21:46:45.919746+00:00",
  "actualizado_em": "2026-03-24T13:17:18.554143+00:00"
}
```

---
### GET /projectos?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /guia?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /configuracoes?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /reunioes?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /rest/v1/users?select=*&id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb
- Section: login
- Status: 200
- Response:
```json
{
  "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "nome": "Belmiro Ngola",
  "email": "belmirongola@gmail.com",
  "papel": "membro",
  "whatsapp_numero": "244930117059",
  "avatar_url": "https://lgvgrtqcienrqubnxaqs.supabase.co/storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png",
  "activo": true,
  "onboarding_concluido": false,
  "onboarding_concluido_em": null,
  "criado_em": "2026-03-18T21:46:45.919746+00:00",
  "actualizado_em": "2026-03-24T13:17:18.554143+00:00"
}
```

---
### GET /calendario?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /colaboradores?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /kanban?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /tarefas?_rsc=18t7j
- Section: login
- Status: 200

---
### HEAD /rest/v1/notificacoes?select=*&user_id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb&lida=eq.false&canal=in.%28dashboard%2Cambos%29
- Section: login
- Status: 200

---
### HEAD /rest/v1/tarefas?select=id&estado=eq.concluido&actualizado_em=gte.2026-03-26T00%3A00%3A00
- Section: login
- Status: 200

---
### HEAD /rest/v1/projectos?select=id&estado=eq.activo
- Section: login
- Status: 200

---
### HEAD /rest/v1/tarefas?select=id&prazo=lt.2026-03-26&estado=not.in.%28%22concluido%22%2C%22cancelado%22%29
- Section: login
- Status: 200

---
### HEAD /rest/v1/tarefas?select=id
- Section: login
- Status: 200

---
### GET /rest/v1/users?select=*&id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb
- Section: login
- Status: 200
- Response:
```json
{
  "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "nome": "Belmiro Ngola",
  "email": "belmirongola@gmail.com",
  "papel": "membro",
  "whatsapp_numero": "244930117059",
  "avatar_url": "https://lgvgrtqcienrqubnxaqs.supabase.co/storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png",
  "activo": true,
  "onboarding_concluido": false,
  "onboarding_concluido_em": null,
  "criado_em": "2026-03-18T21:46:45.919746+00:00",
  "actualizado_em": "2026-03-24T13:17:18.554143+00:00"
}
```

---
### GET /guia?_rsc=oh8t4
- Section: login
- Status: 200

---
### GET /guia?_rsc=585va
- Section: login
- Status: 200

---
### GET /dashboard?_rsc=18t7j
- Section: login
- Status: 200

---
### GET /guia?_rsc=1yeh9
- Section: login
- Status: 200

---
### GET /configuracoes?_rsc=1gcgx
- Section: login
- Status: 200

---
### GET /rest/v1/users?select=*&id=eq.49b8561d-31c7-4f9f-a234-af16b504e5eb
- Section: login
- Status: 200
- Response:
```json
{
  "id": "49b8561d-31c7-4f9f-a234-af16b504e5eb",
  "nome": "Belmiro Ngola",
  "email": "belmirongola@gmail.com",
  "papel": "membro",
  "whatsapp_numero": "244930117059",
  "avatar_url": "https://lgvgrtqcienrqubnxaqs.supabase.co/storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png",
  "activo": true,
  "onboarding_concluido": false,
  "onboarding_concluido_em": null,
  "criado_em": "2026-03-18T21:46:45.919746+00:00",
  "actualizado_em": "2026-03-24T13:17:18.554143+00:00"
}
```

---
### GET /guia?_rsc=14xkb
- Section: login
- Status: 200

---
### GET /configuracoes?_rsc=oh8t4
- Section: login
- Status: 200

---
### GET /guia?_rsc=1fpbl
- Section: login
- Status: 200

---
### GET /rest/v1/users?select=id%2Cnome%2Ccriado_em&order=criado_em.desc&limit=2
- Section: login
- Status: 200
- Response:
```json
[
  {
    "id": "6f6ce3fc-0ab0-4654-9aa2-4d2a1cc6a2ed",
    "nome": "Raimundo Joaquim",
    "criado_em": "2026-03-18T21:46:55.441391+00:00"
  },
  {
    "id": "4b52adf4-3094-448a-bde3-344325cb5b97",
    "nome": "Credo Lopes",
    "criado_em": "2026-03-18T21:46:50.521234+00:00"
  }
]
```

---
### GET /rest/v1/projectos?select=id%2Cnome%2Cestado&estado=eq.activo&order=criado_em.desc&limit=6
- Section: login
- Status: 200
- Response:
```json
[
  {
    "id": "7d5908a2-e9cd-4457-9dcb-287be710831e",
    "nome": "[POP-04] Marketing, Conteudo e Redes Sociais",
    "estado": "activo"
  },
  {
    "id": "867746b1-9255-484a-a9ec-6c0f0d2e3adc",
    "nome": "[POP-01] Gestao de Reunioes, Tarefas e Relatorios",
    "estado": "activo"
  },
  {
    "id": "19d69ffb-4a07-42e1-95b1-d5ec842c49ef",
    "nome": "[POP-03] Entrega SIC - Onboarding e Implementacao",
    "estado": "activo"
  },
  {
    "id": "6f372067-a3b6-412a-ad31-be336c88a713",
    "nome": "[POP-02] Gestao Comercial e Pipeline SIC",
    "estado": "activo"
  },
  {
    "id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "nome": "[POP-07] Tecnologia, Agentes IA e Sistemas",
    "estado": "activo"
  },
  {
    "id": "e5050044-886d-4fb3-83f7-b0b7687cd1df",
    "nome": "[POP-08] Operacoes, Logistica e Eventos",
    "estado": "activo"
  }
]
```

---
### GET /rest/v1/tarefas?select=id%2Ctitulo%2Cactualizado_em&estado=eq.concluido&order=actualizado_em.desc&limit=3
- Section: login
- Status: 200
- Response:
```json
[]
```

---
### GET /rest/v1/tarefas?select=id%2Ctitulo%2Cprioridade%2Cestado%2Cprazo%2Cprojecto_id&order=criado_em.desc&limit=7
- Section: login
- Status: 200
- Response:
```json
[
  {
    "id": "7c42345a-935e-48a0-b2fb-facd8a644c2e",
    "titulo": "[03] Qualificacao BANT",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "6f372067-a3b6-412a-ad31-be336c88a713"
  },
  {
    "id": "e223d0c8-bc42-412c-a82f-77a628ae1012",
    "titulo": "[09] Triagem Incidente",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e"
  },
  {
    "id": "eff6a846-0bcb-4b6a-b08e-76e27f62bdc3",
    "titulo": "[02] Arquitectura do Sistema",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e"
  },
  {
    "id": "a47ec082-e53a-46f7-8d18-ac547058d2f1",
    "titulo": "[03] Desenvolvimento",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e"
  },
  {
    "id": "97bd22d8-5890-42b3-96a6-e3063d534d4e",
    "titulo": "[08] Deteccao Incidente",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e"
  },
  {
    "id": "16b9785b-01fb-48cd-b3ac-19ed16de0175",
    "titulo": "[04] Construcao do Agente",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "19d69ffb-4a07-42e1-95b1-d5ec842c49ef"
  },
  {
    "id": "d60b52e7-06e9-4dad-a853-79c51a8122d7",
    "titulo": "[11] Resolucao Incidente",
    "prioridade": "medio",
    "estado": "a_fazer",
    "prazo": null,
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e"
  }
]
```

---
### GET /rest/v1/tarefas?select=id%2Cprojecto_id%2Cestado
- Section: login
- Status: 200
- Response:
```json
[
  {
    "id": "c3a0ae89-7d06-4e1d-ae99-ad6193161fcd",
    "projecto_id": "f07c9106-1f7d-4efe-b157-2b038681ea3d",
    "estado": "a_fazer"
  },
  {
    "id": "d60b52e7-06e9-4dad-a853-79c51a8122d7",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "d952937d-06c8-499f-b2df-f12a49c11f61",
    "projecto_id": null,
    "estado": "a_fazer"
  },
  {
    "id": "4ea3e61b-2212-47fa-a2cd-d240477f8c3e",
    "projecto_id": null,
    "estado": "a_fazer"
  },
  {
    "id": "bdfd8eb7-b2c7-43b7-919e-81617854dded",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "16b9785b-01fb-48cd-b3ac-19ed16de0175",
    "projecto_id": "19d69ffb-4a07-42e1-95b1-d5ec842c49ef",
    "estado": "a_fazer"
  },
  {
    "id": "97bd22d8-5890-42b3-96a6-e3063d534d4e",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "a47ec082-e53a-46f7-8d18-ac547058d2f1",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "eff6a846-0bcb-4b6a-b08e-76e27f62bdc3",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "e223d0c8-bc42-412c-a82f-77a628ae1012",
    "projecto_id": "748359fb-c07d-48c1-8484-5d7a4b520e2e",
    "estado": "a_fazer"
  },
  {
    "id": "7c42345a-935e-48a0-b2fb-facd8a644c2e",
    "projecto_id": "6f372067-a3b6-412a-ad31-be336c88a713",
    "estado": "a_fazer"
  }
]
```

---
### GET /reunioes?_rsc=oh8t4
- Section: dashboard
- Status: 200

---
### GET /configuracoes?_rsc=1cdj3
- Section: dashboard
- Status: 200

---
### GET /reunioes?_rsc=1ob96
- Section: dashboard
- Status: 200

---
### GET /reunioes?_rsc=1iibs
- Section: dashboard
- Status: 200

---
### GET /storage/v1/object/public/avatars/49b8561d-31c7-4f9f-a234-af16b504e5eb/avatar.png
- Section: dashboard
- Status: 200

---
### GET /login?_rsc=1i7t7
- Section: task-detail
- Status: 307

---
### GET /dashboard
- Section: task-detail
- Status: 200

