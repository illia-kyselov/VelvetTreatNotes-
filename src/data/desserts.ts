export type DessertId =
  | 'gelato'
  | 'fruit-tart'
  | 'panettone'
  | 'madeleine'
  | 'creme-brulee';

export type Dessert = {
  id: DessertId;
  title: string;
  category: string;
  pillColor: string;    
  image: any;
  origin: string;
  description: string;
  taste: string;
  fun: string;
};

export const DESSERTS: Dessert[] = [
  {
    id: 'gelato',
    title: 'Gelato',
    category: 'Frozen Treats',
    pillColor: '#FFCC00',
    image: require('../assets/images/desserts/gelato.png'),
    origin: 'Italy',
    description:
      'Origin: Italy\n\nDescription: A dense and creamy frozen dessert made with milk, less air, and intense flavor. Gelato is softer than ice cream and served slightly warmer.\n\nTaste & Texture: Smooth, rich, intensely flavored.\n\nFun Fact: Gelato has about 70% less air than traditional ice cream, making it creamier and more flavorful.',
    taste: '',
    fun: '',
  },
  {
    id: 'fruit-tart',
    title: 'Fruit Tart',
    category: 'Fruit-Based Desserts',
    pillColor: '#00FF4D',
    image: require('../assets/images/desserts/fruit-tart.png'),
    origin: 'France',
    description:
      'Origin: France\n\nDescription: A crisp sweet pastry crust filled with silky custard and topped with colorful seasonal fruits.\n\nTaste & Texture: Buttery crust, smooth cream, bright and refreshing fruit acidity.\n\nFun Fact: A thin apricot jam glaze is often brushed on top to keep fruit shiny and fresh longer.',
    taste: '',
    fun: '',
  },
  {
    id: 'panettone',
    title: 'Panettone',
    category: 'Festive Sweets',
    pillColor: '#C08FFF',
    image: require('../assets/images/desserts/panettone.png'),
    origin: 'Italy',
    description:
      'Origin: Italy\n\nDescription: A tall, airy, brioche-like bread studded with raisins and candied orange, traditionally enjoyed at Christmas.\n\nTaste & Texture: Fluffy and gently sweet with a delicate citrus aroma.\n\nFun Fact: Its signature flavor comes from a long fermentation process that develops unique aromas.',
    taste: '',
    fun: '',
  },
  {
    id: 'madeleine',
    title: 'Madeleine',
    category: 'Creamy Desserts',
    pillColor: '#00FFDD',
    image: require('../assets/images/desserts/madeleine.png'),
    origin: 'France',
    description:
      'Origin: France\n\nDescription: Small, shell-shaped sponge cakes with a tender crumb, often flavored with lemon or vanilla.\n\nTaste & Texture: Light, buttery, and delicate with a slight crisp edge.\n\nFun Fact: The iconic “hump” on top forms from the thermal shock of placing chilled batter into a hot oven.',
    taste: '',
    fun: '',
  },
  {
    id: 'creme-brulee',
    title: 'Crème Brûlée',
    category: 'Baked Goods',
    pillColor: '#F679FF',
    image: require('../assets/images/desserts/creme-brulee.png'),
    origin: 'France',
    description:
      'Origin: France\n\nDescription: A rich baked custard topped with a thin, crackly layer of caramelized sugar.\n\nTaste & Texture: Silky smooth custard beneath a satisfying glass-like sugar crust.\n\nFun Fact: The sugar topping is best caramelized with a torch just before serving for maximum crunch.',
    taste: '',
    fun: '',
  },
];

export const getDessertById = (id: DessertId) => DESSERTS.find(d => d.id === id);
