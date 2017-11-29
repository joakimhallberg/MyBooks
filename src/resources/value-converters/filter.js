export class FilterValueConverter {
  toView (array, searchTerm) {
    return array.filter((item) => {
      return searchTerm && searchTerm.length > 0 ? this.itemMatches(searchTerm, item) : true;
    })
  }

  itemMatches(searchTerm, value) {
    let itemValue = value.title;

    if (!itemValue) return false;

    return itemValue.toUpperCase().indexOf(searchTerm.toUpperCase()) !== -1;
  }
}
