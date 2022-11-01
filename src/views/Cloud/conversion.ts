export const encodeURIString = (name: string | null) => {
  if(!name){
    return "";
  }
  try{
    return btoa(unescape(encodeURIComponent(name)));
  }catch(err){
    return "";
  }
}
export const decodeURIString = (text: string) => {
  try{
    return decodeURIComponent(escape(atob(text)));
  }
  catch(err){
    return text;
  }
}
