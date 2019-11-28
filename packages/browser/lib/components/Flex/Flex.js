"use strict";

require("core-js/modules/web.dom.iterable");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactEmotion = _interopRequireWildcard(require("react-emotion"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Flex =
/*#__PURE__*/
(0, _reactEmotion.default)("div", {
  label: "Flex",
  target: "eiio5u50"
})("display:flex;flex-direction:", (_ref) => {
  let {
    flexDirection
  } = _ref;
  return flexDirection || 'row';
}, ";flex-wrap:", (_ref2) => {
  let {
    wrap
  } = _ref2;
  return wrap || 'wrap';
}, ";", (_ref3) => {
  let {
    alignItems
  } = _ref3;
  return alignItems &&
  /*#__PURE__*/
  (0, _reactEmotion.css)("align-items:", alignItems, ";/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ZsZXgvRmxleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRSyIsImZpbGUiOiIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9GbGV4L0ZsZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVkLCB7IGNzcyB9IGZyb20gJ3JlYWN0LWVtb3Rpb24nO1xuXG5jb25zdCBGbGV4ID0gc3R5bGVkLmRpdmBcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246ICR7KHsgZmxleERpcmVjdGlvbiB9KSA9PiBmbGV4RGlyZWN0aW9uIHx8ICdyb3cnfTtcblx0ZmxleC13cmFwOiAkeyh7IHdyYXAgfSkgPT4gd3JhcCB8fCAnd3JhcCd9O1xuXHQkeyh7IGFsaWduSXRlbXMgfSkgPT5cblx0XHRhbGlnbkl0ZW1zICYmXG5cdFx0Y3NzYFxuXHRcdFx0YWxpZ24taXRlbXM6ICR7YWxpZ25JdGVtc307XG5cdFx0YH07XG5cdCR7KHsganVzdGlmeUNvbnRlbnQgfSkgPT5cblx0XHRqdXN0aWZ5Q29udGVudCAmJlxuXHRcdGNzc2Bcblx0XHRcdGp1c3RpZnktY29udGVudDogJHtqdXN0aWZ5Q29udGVudH07XG5cdFx0YH07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBGbGV4O1xuIl19 */label:Flex;");
}, ";", (_ref4) => {
  let {
    justifyContent
  } = _ref4;
  return justifyContent &&
  /*#__PURE__*/
  (0, _reactEmotion.css)("justify-content:", justifyContent, ";/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ZsZXgvRmxleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFhSyIsImZpbGUiOiIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9GbGV4L0ZsZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3R5bGVkLCB7IGNzcyB9IGZyb20gJ3JlYWN0LWVtb3Rpb24nO1xuXG5jb25zdCBGbGV4ID0gc3R5bGVkLmRpdmBcblx0ZGlzcGxheTogZmxleDtcblx0ZmxleC1kaXJlY3Rpb246ICR7KHsgZmxleERpcmVjdGlvbiB9KSA9PiBmbGV4RGlyZWN0aW9uIHx8ICdyb3cnfTtcblx0ZmxleC13cmFwOiAkeyh7IHdyYXAgfSkgPT4gd3JhcCB8fCAnd3JhcCd9O1xuXHQkeyh7IGFsaWduSXRlbXMgfSkgPT5cblx0XHRhbGlnbkl0ZW1zICYmXG5cdFx0Y3NzYFxuXHRcdFx0YWxpZ24taXRlbXM6ICR7YWxpZ25JdGVtc307XG5cdFx0YH07XG5cdCR7KHsganVzdGlmeUNvbnRlbnQgfSkgPT5cblx0XHRqdXN0aWZ5Q29udGVudCAmJlxuXHRcdGNzc2Bcblx0XHRcdGp1c3RpZnktY29udGVudDogJHtqdXN0aWZ5Q29udGVudH07XG5cdFx0YH07XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBGbGV4O1xuIl19 */label:Flex;");
}, ";/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0ZsZXgvRmxleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFdUIiLCJmaWxlIjoiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvRmxleC9GbGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHN0eWxlZCwgeyBjc3MgfSBmcm9tICdyZWFjdC1lbW90aW9uJztcblxuY29uc3QgRmxleCA9IHN0eWxlZC5kaXZgXG5cdGRpc3BsYXk6IGZsZXg7XG5cdGZsZXgtZGlyZWN0aW9uOiAkeyh7IGZsZXhEaXJlY3Rpb24gfSkgPT4gZmxleERpcmVjdGlvbiB8fCAncm93J307XG5cdGZsZXgtd3JhcDogJHsoeyB3cmFwIH0pID0+IHdyYXAgfHwgJ3dyYXAnfTtcblx0JHsoeyBhbGlnbkl0ZW1zIH0pID0+XG5cdFx0YWxpZ25JdGVtcyAmJlxuXHRcdGNzc2Bcblx0XHRcdGFsaWduLWl0ZW1zOiAke2FsaWduSXRlbXN9O1xuXHRcdGB9O1xuXHQkeyh7IGp1c3RpZnlDb250ZW50IH0pID0+XG5cdFx0anVzdGlmeUNvbnRlbnQgJiZcblx0XHRjc3NgXG5cdFx0XHRqdXN0aWZ5LWNvbnRlbnQ6ICR7anVzdGlmeUNvbnRlbnR9O1xuXHRcdGB9O1xuYDtcblxuZXhwb3J0IGRlZmF1bHQgRmxleDtcbiJdfQ== */");
var _default = Flex;
exports.default = _default;