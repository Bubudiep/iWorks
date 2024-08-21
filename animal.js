const animal = {
  name: "chó",
  species: "gâu gâu",
};
class Animal {
  constructor(name, species) {
    this.name = name ? name : "tên mặc định";
    this.species = species;
  }
}
const dog = new Animal(null, "gâu gâu");
console.log(dog);
