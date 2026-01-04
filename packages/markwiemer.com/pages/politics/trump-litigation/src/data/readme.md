# Trump litigation tracker data

The CSV is the source of truth for this folder, coming from the proprietary and annoying xlsm format of Excel. csv2json.py does the heavy lifting and then I do some manual cleanup via find and replace:

- `citation` prop key shouldn't have weird Unicode in it
- don't need that extra `"": ""` prop in each object

I am keeping the CSV in this repo for now as a way for folks to get a good view of the underlying data. The xlsm sheet is just as messy, I promise. All data comes from the Just Security tracker and my layperson interpretation of the underlying court records from courtlistener.com. "Who's winning" and other columns not present in the Just Security tracker are my own.
