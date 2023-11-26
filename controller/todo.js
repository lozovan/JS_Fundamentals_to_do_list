/*
оголошення классу  і конструктура
*/
class Todo {
    constructor(value, checked = false, color = '#ff9900') {
        this.value = value;
        this.checked = checked;
        this.color = color;
    }
}
/*
 експортуємо сласс Todo щоб мати змогу використовувати його в подальшому
*/
export default Todo;