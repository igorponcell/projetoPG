# projetoPG
                            Projeto desenvolvido para cadeira de Processamento Gráfico - IF680
                            

   O problema proposto foi de criar um programa que realizasse Interpolação Linear de Curvas de Bézier num outra de mesmo grau

  A ideia inicial é que o grau de cada curva seria arbritario, desde que fosse o mesmo para ambas e que pudesse visualizar cada curva
gerada pela interpolação.

  Breve resumo sobre o que foi implementado:
O usuário deve setar o **grau da curva** no script na variável **degree** (a ideia inicial era que o valor fosse pego no front-end, mas como
não foi possivel implementar o projeto vai funcionar dessa forma) em seguida o usuario deve **criar os pontos de controle na area preta da tela(stage)** e as curvas originais serão formadas. Ao criar as duas curvas com a quantidade de pontos que foi determinada o **botão de desenhar** a curva estara disponivel para ser clicado. O botão chama uma funçao que usará os pontos originais para gerar as curvas de intepolação através de *Casteljau*.

O usuário pode alterar o valor do menu de parametros e as alterações acontecerão em **tempo real**.

O usuário também pode clicar nos checkbox da area **"exibir"** onde através da comunicação criada com auxilio da *bonsai.js* os pontos, segmentos, curvas e curvas T serão escondidos.

