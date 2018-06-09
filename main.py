import requests
from bs4 import BeautifulSoup
import json
import pathlib

current_dir = pathlib.Path(__file__).parent
data_folder = current_dir / 'data/movies.json'

urls = []

titles = []
box_office_numbers = []

for url in urls:
    result = requests.get(url, timeout=5)
    content = result.content

    soup = BeautifulSoup(content, "html.parser")

    box_office_number = []
    date_of_number = []

    title = soup.find('title').get_text()
    title = title.split('-')
    title = title[0].strip()
    titles.append(title)

    table = soup.select(".chart-wide")
    if table:
        for row in table:
            rows = table[0].find_all('tr')[1:]
            for column in rows:
                columns = column.find_all('td')
                if len(columns) > 1:
                    box_office_number.append(columns[3].get_text())
                    date_of_number.append(columns[1].get_text())
    else:
        print('table not found')

    box_office_numbers.append(box_office_number)

movie_json = dict(zip(titles, box_office_numbers))

with open(data_folder, 'w') as outfile:
    json.dump(movie_json, outfile, sort_keys=True, indent=4)
