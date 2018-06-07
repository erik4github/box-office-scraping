import requests
from bs4 import BeautifulSoup

url = ""
result = requests.get(url)
content = result.content

soup = BeautifulSoup(content)
soup.prettify()

table = soup.select(".chart-wide")
for row in table:
  rows = table[0].find_all('tr')[1:]
  for column in rows:  
    columns = column.find_all('td')
    if len(columns) > 1:
      print(columns[3].get_text())
