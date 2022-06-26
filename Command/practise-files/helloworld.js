class Person{
    constructor(n, e, g){
    this.name=n;
    this.email=e;
    this.gender=g;
    }
    introCard()
    {
    return "Name: "+ this.name + "\n" + "Email: " + this.email + "\n";
    }
   };
   let person = new Person("Sarim Baig", "s.baig@imperial.ac.uk",'M');
   console.log(person.introCard());
   