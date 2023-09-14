// Dict : 사전 클래스
// Dict.add : 단어 추가
// Dict.get : 단어 정의 리턴
// Dict.delete : 단어 삭제
// Dict.update : 단어 업데이트
// Dict.showAll : 단어 모두보기
// Dict.count : 단어 총 갯수
// Dict.upsert : 업데이트 하면서, 없으면 추가
// Dict.exists : 해당 단어가 사전에 존재하는지 여부
// Dict.bulkAdd : [{term:"", definition:""},{term:"", definition:""}] 방식으로 단어 한번에 추가
// Dict.bulkDelete : ["",""] 방식으로 단어 한번에 삭제

interface IWord {
  term: string;
  definition?: string;
}

class Word {
  protected word: IWord = { term: "", definition: "" };
  protected setWord(term: string, definition: string): void {
    this.word.term = term;
    definition && (this.word.definition = definition);
  }
  protected getWord(): IWord {
    return { ...this.word };
  }
}

class Dict extends Word {
  private dictionary: IWord[] = [];
  private static findIndex(arr: IWord[], term: string) {
    return arr.findIndex((item) => item.term === term);
  }
  add(term: string, definition: string = "") {
    const index = Dict.findIndex(this.dictionary, term);
    super.setWord(term, definition);
    if (index === -1) {
      this.dictionary.push(super.getWord());
    } else {
      this.dictionary[index] = super.getWord();
    }
  }
  get(term: string) {
    const index = Dict.findIndex(this.dictionary, term);
    if (index >= 0) {
      return this.dictionary[index];
    } else {
      return "Not found";
    }
  }
  delete(term: string) {
    const index = Dict.findIndex(this.dictionary, term);
    if (index >= 0) {
      this.dictionary.splice(index, 1);
      return index;
    } else {
      return -1;
    }
  }
  update(term: string, newTerm: string, newDefinition: string = "") {
    const index = Dict.findIndex(this.dictionary, term);
    if (index >= 0) {
      this.dictionary[index].term = newTerm;
      this.dictionary[index].definition = newDefinition;
      return index;
    } else {
      return -1;
    }
  }
  showAll() {
    return this.dictionary;
  }
  count() {
    return this.dictionary.length;
  }
  upsert(term:string, definition:string = "") {
    const index = Dict.findIndex(this.dictionary, term);
    super.setWord(term, definition);
    if (index >= 0) {
        this.dictionary[index] = super.getWord();
        return index;
    } else {
        this.dictionary[this.dictionary.length] = super.getWord();
        return -1;
    }
  }
  exists(term:string) {
    const index = Dict.findIndex(this.dictionary, term);
    if (index >= 0) {
        return true;
    } else {
        return false;
    }
  }
  bulkAdd(text:string) {
    const splitText = text.split(`"`);
    const filteredData = splitText.filter((item, index) => index % 2 === 1 );
    const terms = filteredData.filter((item, index) => index % 2 === 0 );
    const definitions = filteredData.filter((item, index) => index % 2 === 1 );
    const combinedWords = terms.map((term, index) => {
      const definition = definitions[index];
      return { term, definition };
    });
    this.dictionary = [...this.dictionary, ...combinedWords];
  }
  bulkDelete (text:string) {
    const splitText = text.split(`"`);
    splitText.shift();
    splitText.pop();
    const termsToDelete = splitText.filter((item, index) => index % 2 === 0);
    termsToDelete.forEach(item => {
      const index = Dict.findIndex(this.dictionary, item);
      if (index >= 0) {
        this.dictionary.splice(index, 1);
      }
    });
  }
 }

const dict = new Dict();
//add
dict.add("피자", "둥근 도우 위에 치즈 등을 뿌려 구운 이탈리아 음식");
dict.add("김치", "배추, 무 등의 채소를 소금에 절여 양념해서 숙성시킨 음식");
dict.add(
  "떡볶이",
  "고추장, 물엿, 설탕 등의 소스를 만들어 끓이고 얇고 가는 떡을 볶은 음식"
);
dict.add(
  "떡볶이",
  "고추장, 물엿, 설탕 등을 냄비 넣고 끓이고 얇고 가는 떡을 볶은 음식"
);
dict.add(
  "라면",
  "밀로 만든 면을 물, 고춧가루, MSG, 다대기 등을 넣고 끓인 음식"
);

//get
console.log(dict.get("피자"));

//delete
console.log(dict.get("김치"));
dict.delete("김치");
console.log(dict.get("김치"));

//update
dict.update("피자", "서양빈대떡", "감자전이 최고");
console.log(dict.get("피자"));
console.log(dict.get("서양빈대떡"));

//showAll
console.log(dict.showAll());

//count
console.log(dict.count());

//upsert
dict.upsert("라면", "인스턴트 라면을 조리예 대로 끓이세요");
dict.upsert("김밥", "김이 붙어있고 맛있으면 다 김밥");
console.log(dict.showAll());

// exist
console.log(dict.exists("피자"));
console.log(dict.exists("서양빈대떡"));

// bulkAdd
dict.bulkAdd(`[{term:"하와이안 피자", definition:"피자에 파인애플이!"},{term:"민트 초코 케이크", definition:"상큼한 맛!"}]`);
console.log(dict.showAll());

// bulkDelete
dict.bulkDelete(`["하와이안 피자", "Pizza", ,"서양빈대떡"]`);
console.log(dict.showAll());