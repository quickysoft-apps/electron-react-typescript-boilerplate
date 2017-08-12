async (input) => { 
  string text;
  var fileStream = new System.IO.FileStream(input.fullPath, System.IO.FileMode.Open, System.IO.FileAccess.Read);
  using (var streamReader = new System.IO.StreamReader(fileStream, System.Text.Encoding.UTF8))
  {
    text = streamReader.ReadToEnd();
  }
  return text;
}